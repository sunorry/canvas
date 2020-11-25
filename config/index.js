module.exports = {
    env: {
        development: {
            apiDomain: 'http://bc.inf.test.sankuai.com',
            ssoDomain: 'http://sso.it.beta.sankuai.com',
            ssoHost: 'http://ssosv.it.beta.sankuai.com/sson',
            ssoClientId: 'com.sankuai.fetc.databook.databookfe',
            env: 'local',
            publicPath: '/'
        },
        test: {
            apiDomain: '/',
            ssoDomain: '//sso.it.beta.sankuai.com',
            ssoHost: '//ssosv.it.beta.sankuai.com/sson',
            ssoClientId: 'com.sankuai.fetc.databook.databookfe',
            env: 'test',
            publicPath: '/'
        },
        staging: {
            apiDomain: '/',
            ssoDomain: '//sso.sankuai.com',
            ssoHost: '//ssosv.sankuai.com/sson',
            ssoClientId: 'com.sankuai.fetc.databook.databookfe',
            env: 'st',
            publicPath: '/'
        },
        production: {
            apiDomain: '/',
            ssoDomain: '//sso.sankuai.com',
            ssoHost: '//ssosv.sankuai.com/sson',
            ssoClientId: 'com.sankuai.fetc.databook.databookfe',
            env: 'prod',
            publicPath: '/'
        }
    }
};
