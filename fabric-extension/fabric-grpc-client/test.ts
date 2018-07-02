import { Client } from './client';
import { Config } from 'shared';
let config: Config = {
    Network: {
        Channel: 'mychannel',
        Orderer: 'http://localhost:7050',
        Peers: [
            'http://localhost:7051'
        ],
        Hubs: [
            'http://localhost:7053'
        ]
    },
    Identity: {
        Msp: 'MainOrgMSP',
        Key: '-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgU3tEhOdIpi0C3ETO\njsXa/8d2IiJ3HOKEbKtr5VwvQuuhRANCAAQj18/ykf/tjQiksmYhct7dQCXjDInX\nap+OxfBuh9VcexNb2r2r/Vhe57c4F5UrjPLrkJmC2nI0HoAZ4uB/5PBC\n-----END PRIVATE KEY-----\n',
        Certificate: '-----BEGIN CERTIFICATE-----\nMIICMzCCAdqgAwIBAgIRAPqHGyhW4r5ppcuOuskqcWYwCgYIKoZIzj0EAwIweDEL\nMAkGA1UEBhMCREUxDDAKBgNVBAgTA05SVzESMBAGA1UEBxMJQmllbGVmZWxkMSEw\nHwYDVQQKExhtYWlub3JnLmhlYWx0aC1sZWRnZXIuZGUxJDAiBgNVBAMTG2NhLm1h\naW5vcmcuaGVhbHRoLWxlZGdlci5kZTAgFw0xODA1MzAwMDAzMTlaGA8yMTE4MDUw\nNjAwMDMxOVowbjEXMBUGA1UEAwwOSGFucyBNw4PCvGxsZXIxCzAJBgNVBAYTAkRF\nMQwwCgYDVQQIDANOUlcxITAfBgNVBAoMGG1haW5vcmcuaGVhbHRoLWxlZGdlci5k\nZTEVMBMGA1UECwwMVmVyc2ljaGVydW5nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcD\nQgAEI9fP8pH/7Y0IpLJmIXLe3UAl4wyJ12qfjsXwbofVXHsTW9q9q/1YXue3OBeV\nK4zy65CZgtpyNB6AGeLgf+TwQqNNMEswDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB\n/wQCMAAwKwYDVR0jBCQwIoAgZtgEVzqDE54+row60NKXoVreZIAYRFU1klbDSJZu\nACowCgYIKoZIzj0EAwIDRwAwRAIgIcF7V9d/hA87+VZBE1F3nbFE/qkmrBtKC+Y6\nb+/B2YkCIDofZv3tE86I4LJtiAqSj8c85fFtrblDYWltoB4lURRh\n-----END CERTIFICATE-----\n'
    },
    Matches: /asd/
};

async function test() {
    try {
        let c = new Client(config);
        let result = await c.QueryByChaincode('healthledger', 'request.get');
        console.log(result);
    }
    catch (err) {
        console.log(err);
    }
}

test();