# Scatter Reservation


Validating the EOS registration price:

- Go to: **https://www.myetherwallet.com/#contracts**
- Enter the address: **0x6b3f3b20c5747c78abd5a53489d868e2c9fbf904**
- Copy everything inside of **https://raw.githubusercontent.com/nsjames/scatter-airdrop/master/src/copied/assets/scatter_abi.json**
 and paste it into the ABI input field.
- Click "Access"
- From the drop-down click **reservationPrice**. That will show you the current EOS price of reservation
  ( times 18 decimals, ethereum erc20 standard )
- The code that takes this price in the front end is here: **https://github.com/nsjames/scatter-airdrop/blob/master/src/services/ContractService.js#L26**
 