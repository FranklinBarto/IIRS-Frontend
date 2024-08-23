const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://172.27.4.136:8000/',
            changeOrigin: true,
        })
    );
};