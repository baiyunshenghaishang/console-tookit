const tty = require('tty')
const ttys = require('ttys')
const rl = require('readline')

const stdin = ttys.stdin
const stdout = ttys.stdout

stdin.setRawMode(true)
stdin.resume()
stdin.setEncoding('utf8')

function getChar() {
    return new Promise((resolve) => {
        stdin.once('data', function (key) {
            resolve(key)
        })
    })
}

function up(n = 1) {
    stdout.write('\033[' + n + 'A')
}
function down(n = 1) {
    stdout.write('\033[' + n + 'B')
}
function left(n = 1) {
    stdout.write('\033[' + n + 'D')
}
function right(n = 1) {
    stdout.write('\033[' + n + 'C')
}

async function select(choices) {
    let selected = 0
    for (let i = 0; i < choices.length; i++) {
        let choice = choices[i]
        if (selected == i) {
            stdout.write('[x] ' + choice + '\n')
        } else {
            stdout.write('[ ] ' + choice + '\n')
        }
    }
    up(choices.length)
    right()
    while (true) {
        let char = await getChar()
        if (char === '\u0003') {
            process.exit()
        }
        if (char === 'w' && selected > 0) {
            stdout.write(' ')
            left()
            selected--
            up()
            stdout.write('x')
            left()
        }
        if (char === 's' && selected < choices.length - 1) {
            stdout.write(' ')
            left()
            selected++
            down()
            stdout.write('x')
            left()
        }
        if (char === '\r') {
            down(choices.length - selected)
            left()
            return choices[selected]
        }
    }
}

void (async function () {
    stdout.write('which framework do you want\n')
    let choice = await select(['vue', 'react', 'angular'])
    stdout.write('your choice is ' + choice)
    process.exit()
})()
