const express = require('express')

router.get('/', (req, res, next) => {
  res.json({
    test: 'ok'
  })
})

module.exports = router
