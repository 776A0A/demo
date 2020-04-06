function spawn (g) {
  return new Promise((resolve, reject) => {

    g = g()

    function run (g) {
      let res;

      try {
        res = g()
      } catch (e) {
        return reject(e)
      }

      if(res.done) return resolve(res.value)

      Promise.resolve(res.value).then(
        val => run(() => g.next(val)),
        err => run(() => g.throw(err))
      )
    }

    run(() => g.next())

  })
}