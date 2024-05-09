module.exports = {
    getURL: (req) => req.protocol + '://' + req.get('host'),
    getFullURL: (req) => getURL(req) + req.originalUrl,
}