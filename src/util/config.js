export default (key, defaultValue = null) => {

    console.log(key, process.env[key])

    if (!process.env.hasOwnProperty(key)){
        if (!!defaultValue) return defaultValue;
        throw new Error(`Missing configuration and no default configuration: ${key}`);
    }

    return process.env[key];
}