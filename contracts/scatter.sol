pragma solidity ^0.4.0;

contract ScatterReservation {

    // STRUCTS
    // ---------------------------------
    struct Reservation {
        uint id;
        bytes1 entityType;
        bytes24 name;
        bytes publicKey;
    }

    struct Bid {
        uint reservationId;
        bytes publicKey;
        uint price;
        uint timestamp;
    }


    // STATE VARIABLES
    // ---------------------------------
    address EOS = 0xe4c88109389de19f0db83f422f341f9e1be22925;
    uint constant bidTimeout = 2 days;

    address public owner;
    address public signatory;
    uint public reservationPrice;

    mapping (uint => address) public reservers;
    mapping (uint => Reservation) public reservations;
    mapping (uint => Reservation) public pendingReservations;

    mapping (uint => address) public bidders;
    mapping (uint => Bid) public bids;
    mapping (uint => uint) public lastSoldFor;

    mapping (bytes24 => uint) public names;
    mapping (bytes24 => uint) public pendingNames;
    mapping (uint => bytes1[]) public genetics;

    uint public atomicResId;

    // CONSTRUCTOR
    // ---------------------------------
    function ScatterReservation() public {
        owner = msg.sender;
        atomicResId = 0;
        reservationPrice = 1000000000000000000;
    }


    // MODIFIERS
    modifier only(address _address){
        require(msg.sender == _address);
        _;
    }

    modifier beforeChainLaunch() {
        //        require(now < now);
        _;
    }

    // EVENTS
    // ---------------------------------
    event EmitReservation(uint reservationId);
    event EmitPendingReservation(uint reservationId);
    event EmitDappDecision(uint reservationId);
    event EmitBid(uint reservationId);
    event EmitUnBid(uint reservationId);
    event EmitSell(uint reservationId);
    event EmitError(string msg);

    // READ
    // ---------------------------------
    function currentId() public constant returns (uint) {
        return atomicResId;
    }

    function exists(bytes24 name) public constant returns (bool) {
        return names[name] > 0 || pendingNames[name] > 0;
    }

    function reservationOwner(uint rId) public constant returns (address) {
        return reservers[rId];
    }

    function bidOwner(uint rId) public constant returns (address) {
        return bidders[rId];
    }

    function getGenetics(uint rId) public constant returns (bytes1[]) {
        return genetics[rId];
    }


    // WRITE
    // ---------------------------------
    function setSignatory(address _signatory) public only(owner) {
        signatory = _signatory;
    }

    function setEOSAddress(address _address) public only(owner) {
        EOS = _address;
    }

    function setReservationPrice(uint _price) public only(owner) {
        reservationPrice = _price;
    }

    /***
     * Reserves a User Identity
     * */
    function reserveUser(bytes24 name, bytes pkey) public returns (uint) {
        require(name != 0x0);
        require(!exists(name));
        require(validReservation(name,pkey));
        require(takeEOS(reservationPrice));
        atomicResId++;

        names[name] = atomicResId;
        reservers[atomicResId] = msg.sender;
        reservations[atomicResId] = Reservation(atomicResId, 0, name, pkey);
        genetics[atomicResId].push(gene(name,pkey));
        lastSoldFor[atomicResId] = reservationPrice;
        EmitReservation(atomicResId);
        return atomicResId;
    }

    /***
     * Reserves a Dapp Identity
     * */
    function reserveDapp(bytes24 name, bytes pkey) public returns (uint) {
        require(pendingNames[name] == 0);
        require(validReservation(name,pkey));
        require(takeEOS(reservationPrice));
        atomicResId++;

        pendingNames[name] = atomicResId;
        reservers[atomicResId] = msg.sender;
        pendingReservations[atomicResId] = Reservation(atomicResId, 1, name, pkey);
        EmitPendingReservation(atomicResId);
        return atomicResId;
    }

    /***
     * Used for merging pending reservations with reservations
     * */
    function dappDecision(uint id, bool accepted) public only(signatory) {
        Reservation storage r = pendingReservations[id];
        require(r.id == id);

        if(accepted) {
            // Return funds to possible user owner
            if(names[r.name] > 0 && lastSoldFor[id] > 0)
                giveEOS(reservers[names[r.name]], lastSoldFor[id]);

            lastSoldFor[id] = reservationPrice;
            reservations[id] = r;
            names[r.name] = id;

        }

        delete pendingNames[r.name];
        delete pendingReservations[id];
        EmitDappDecision(id);
    }

    /***
    * Bids on a reservation.
    */
    function bid(uint rId, uint price, bytes pkey) public returns (uint) {
        assert(reservers[rId] != msg.sender);
        require(reservations[rId].id > 0);
        require(validPkey(pkey));
        require(!equalBytes(reservations[rId].publicKey, pkey));
        require(lastSoldFor[rId] < price);
        require(bids[rId].price < price);

        // Taking bid price in EOS
        require(takeEOS(price));

        // Returning previous bid if existing
        Bid storage b = bids[rId];
        if(b.reservationId > 0){
            require(b.price < price);
            giveEOS(bidders[rId], b.price);
        }

        bidders[rId] = msg.sender;
        bids[rId] = Bid(rId, pkey, price, now);
        EmitBid(rId);
        return rId;
    }

    /***
    * Unbids on a stale reservation
    */
    function unBid(uint rId) public {
        assert(bidders[rId] == msg.sender);
        require(bids[rId].reservationId > 0);
        require(bids[rId].timestamp >= now + bidTimeout);

        // Returning funds
        giveEOS(bidders[rId], bids[rId].price);

        // Removing bid
        delete bids[rId];
        delete bidders[rId];

        EmitUnBid(rId);
    }

    function sell(uint rId) public {
        assert(reservers[rId] == msg.sender);
        require(reservations[rId].id > 0);
        require(bidders[rId] > 0);
        require(bids[rId].price > 0);

        // Moving EOS funds
        require(takeEOS(bids[rId].price));
        require(giveEOS(bidders[rId], bids[rId].price)); //  - bids[rId].price*0.01 (1% tax)

        // Changing ownership
        reservations[rId].publicKey = bids[rId].publicKey;
        reservers[rId] = bidders[rId];
        lastSoldFor[rId] = bids[rId].price;

        // Adding gene
        if(genetics[rId].length < 5)
            genetics[rId].push(gene(bytes24(msg.sender),bids[rId].publicKey));

        // Removing bid
        delete bids[rId];
        delete bidders[rId];


        EmitSell(rId);
    }




    // EOS
    // ---------------------------------
    function takeEOS(uint price) internal returns(bool) {
        require(price <= ERC20(EOS).allowance(msg.sender, this));
        if(!ERC20(EOS).transferFrom(msg.sender, this, price)){
            revert();
            return false;
        }
        return true;
    }

    function giveEOS(address to, uint price) internal returns(bool) {
        if(!ERC20(EOS).transfer(to, price)){
            revert();
            return false;
        }
        return true;
    }



    // HELPERS
    // ---------------------------------
    function validReservation(bytes24 name, bytes pkey) internal pure returns (bool){
        assert(name.length > 2);
        validPkey(pkey);
        return true;
    }

    function validPkey(bytes pkey) internal pure returns (bool){
        assert(pkey.length > 30);
        return true;
    }

    function equalBytes(bytes a, bytes b) internal pure returns (bool) {
        return keccak256(a) == keccak256(b);
    }

    function gene(bytes24 name, bytes pkey) internal view returns(bytes1) {
        return randomChar(uint(random(uint(name)+ uint(first8(pkey)))));
    }

    function randomChar(uint g) internal pure returns(bytes1){
        return g > 90 ? byte("A") : g > 60 ? byte("B") : g > 30 ? byte("C") : byte("D");
    }

    function random(uint seed) internal view returns (uint randomNumber) {
        return uint(keccak256(block.blockhash(block.number-1), seed ))%100+1;
    }

    function first8(bytes inBytes) internal pure returns (bytes8 outBytes8) {
        if (inBytes.length == 0) return 0x0;
        assembly { outBytes8 := mload(add(inBytes, 32)) }
    }
}

contract ERC20 {
    function totalSupply() public constant returns (uint supply);
    function balanceOf( address who ) public constant returns (uint value);
    function allowance( address owner, address spender ) public constant returns (uint _allowance);

    function transfer( address to, uint value) public returns (bool ok);
    function transferFrom( address from, address to, uint value) public returns (bool ok);
    function approve( address spender, uint value ) public returns (bool ok);

    event Transfer( address indexed from, address indexed to, uint value);
    event Approval( address indexed owner, address indexed spender, uint value);
}
