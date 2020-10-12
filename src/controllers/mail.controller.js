const send = (req, res, next) => {
  console.log('request', req)
  res.send({ msg: 'success' })
}

module.exports = {
  send
}
