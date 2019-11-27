const fs = require('fs')
const parse = require('csv-parse')

module.exports = (file) => {
  return new Promise((resolve) => {
    const output = []
    // Create the parser
    const parser = parse({
      delimiter: '\n'
    })
    // Use the readable stream api
    parser.on('readable', function(){
      let record
      while (record = parser.read()) {
        output.push(record)
      }
    })
    // Catch any error
    parser.on('error', function(err){
      console.error(err.message)
    })
    // When we are done, test that the parsed output matched what expected
    parser.on('end', function(){
      // console.log('end', output)
      resolve(output)
    })

    parser.write(fs.readFileSync(file))
    parser.end()
  })
}