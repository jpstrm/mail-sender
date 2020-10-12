const health = (req, res, next) => {
  const health = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  }
  try {
    res.send(health)
  } catch (e) {
    health.message = e
    res.status(503).send()
  }
}

module.exports = health
