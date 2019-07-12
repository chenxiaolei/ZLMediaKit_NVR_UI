
var apiDomin = `${location.protocol}//localhost:8099`;

const APIV1 = apiDomin + '/index/api';

module.exports = {
    YQL: [],
    CORS: [apiDomin],
    api_domin: apiDomin,
    api: {
        searchChannelConfigs: `${APIV1}/searchChannelConfigs`,
        searchChannelConfig: `${APIV1}/searchChannelConfig`,
        updateChannelConfig: `${APIV1}/updateChannelConfig`,
        createChannelConfig: `${APIV1}/createChannelConfig`,
        saveChannelConfig: `${APIV1}/saveChannelConfig`,
        deleteChannelConfig: `${APIV1}/deleteChannelConfig`,

        queryRecordMonthly: `${APIV1}/queryRecordMonthly`,
        queryRecordDaily: `${APIV1}/queryRecordDaily`,

        touchChannelProxyStream: `${APIV1}/touchProxyStream`,

        setServerConfig: `${APIV1}/setServerConfig`,
        getServerConfig: `${APIV1}/getServerConfig`,

        restartServer: `${APIV1}/restartServer`,

        getThreadsLoad: `${APIV1}/getThreadsLoad`,

        getMediaList: `${APIV1}/getMediaList`,
        closeStream: `${APIV1}/close_stream`,
        getAllSession: `${APIV1}/getAllSession`,
        kickSession: `${APIV1}/kick_session`,

        addStreamProxy: `${APIV1}/addStreamProxy`,
        delStreamProxy: `${APIV1}/delStreamProxy`,

        addFFmpegSource: `${APIV1}/addFFmpegSource`,
        delFFmepgSource: `${APIV1}/delFFmepgSource`,
    },
};
