function State (target, name, player) {
  // All states need access to target and at least bare function handlers.
  this.target = target

  this.click = function (evt) {
  }

  this.entry = function () {
  }

  this.exit = function () {
  }

  function show (element) {
    element.style.display = 'block'
  }

  function hide (element) {
    element.style.display = 'none'
  }

  function checkWinner (squares, sym) {
    var runs = []
    var result = false

    // Check horizontal
    for (var i = 0; i < 7; i += 3) {
      runs.push([])
      for (var j = i; j < i + 3; j++) {
        runs[runs.length - 1].push(squares[j].innerText)
      }
    }

    // Check vertical
    for (i = 0; i < 3; i++) {
      runs.push([])
      for (j = i; j < 9; j += 3) {
        runs[runs.length - 1].push(squares[j].innerText)
      }
    }

    // Check Diagonal Down
    runs.push([])
    for (i = 0; i < 9; i += 4) {
      runs[runs.length - 1].push(squares[i].innerText)
    }

    // Check Diagonal Up
    runs.push([])
    for (i = 2; i < 7; i += 2) {
      runs[runs.length - 1].push(squares[i].innerText)
    }

    // Return true/false
    result = runs.filter(function (run) {
      // console.log(run)
      return run.every(function (cell) {
        return cell === sym
      })
    }).length > 0
    return result
  }

  // If name is 'options'
  if (name === 'options') {
    // provide the option of one- or two- players and if player one is x or o
    this.entry = function () {
      show(this.target.options)
    }

    this.exit = function () {
      hide(this.target.options)
      this.target.resetBoard(this.target)
      show(this.target.board)
    }

    this.click = function (evt) {
      var t = evt.target
      if (t.classList.contains('option')) {
        // If user is selecting an option, highlight it
        t.parentNode.childNodes.forEach(function (node) {
          if (node.nodeType === 1) node.classList.remove('selected')
        })
        t.classList.add('selected')
      } else if (t.parentNode.id === 'start-game') {
        // If user has pressed start, setup the game and go
        this.target.startGame()
      }
      return false
    }
  }

  if (name === 'gameover') {
    this.entry = function () {
      var nextTurn = this.target.gameover.innerText.startsWith('O')
        ? this.target.states.oturn
        : this.target.states.xturn

      show(this.target.gameover)

      function done () {
        this.target.changeState(nextTurn)
      }

      setTimeout(done.bind(this), 3000)
    }

    this.exit = function () {
      hide(this.target.gameover)
      this.target.resetBoard()
    }
  }

  if (/turn/.test(name) && /(human|computer)/.test(player)) {
    // If this state is somebody'e turn and we were passed a human or computer
    // If given, player should be either 'human' or 'computer'. Use this to choose
    // a function for entry(). If 'human', add event listeners to handle a
    // move by the player. If 'computer', provide the ai function to entry() then
    // end the turn.

    this.entry = function () {
      this.target.turnCount++
      if (player === 'computer') {
        // Computer make a move.
        // Check if game over
        // If continuing, go to next turn
        var nextTurn = name === 'xturn'
          ? this.target.states.oturn
          : this.target.states.xturn

        this.target.changeState(nextTurn)
      }
    }

    this.exit = function () {
    }

    this.click = function (evt) {
      if (player === 'computer') return false
      var t = evt.target
      if (t.classList && t.classList.contains('square') && t.innerText === '') {
        t.innerText = name.substr(0, 1).toUpperCase()
        // console.log(checkWinner(this.target.dom_squares, t.innerText))
        if (checkWinner(this.target.dom_squares, t.innerText)) {
          this.target.gameover.innerText = t.innerText + this.target.winnerText
          this.target.changeState(this.target.states.gameover)
        } else {
          var nextTurn = name === 'xturn'
            ? this.target.states.oturn
            : this.target.states.xturn
          this.target.changeState(nextTurn)
        }
      }
    }
  }
}

function Game () {
  this.board = document.getElementById('board')
  this.options = document.getElementById('options')
  this.gameover = document.getElementById('gameover')
  this.dom_squares = Array.from(this.board.childNodes).filter(function (node) {
    return (node.nodeType === 1)
  })

  this.changeState = function (state) {
    if (this.state !== state) {
      this.state && this.state.exit()
      this.state = state
      this.state.entry()
    }
  }

  this.click = function (e) {
    this.state.click(e)
    return false
  }

  this.resetBoard = function () {
    this.dom_squares.map(function (x) {
      x.innerText = ''
    })
  }

  this.startGame = function () {
    var playerMode = getSelectedOption(Array.from(document.querySelector('#option-players').childNodes)) || 'two-player'
    var symbol = getSelectedOption(Array.from(document.querySelector('#option-symbol').childNodes)) || 'x'

    var xPlayer = (playerMode === 'two-player' || symbol === 'x') ? 'human' : 'computer'
    var oPlayer = (playerMode === 'two-player' || symbol === 'o') ? 'human' : 'computer'

    this.states.xturn = new State(this, 'xturn', xPlayer)
    this.states.oturn = new State(this, 'oturn', oPlayer)
    console.log(this.states)
    this.turnCount = 1
    this.changeState(this.states.xturn)
  }

  this.states = {}
  this.states.options = new State(this, 'options')
  this.states.gameover = new State(this, 'gameover')

  this.winnerText = ' wins! \nWinner starts next game.'
  this.tieText = 'A draw! Fillme starts next game.'

  function getSelectedOption (nodelist) {
    // Expect nodelist to be an array of nodes.
    // Return the id of the selected node, or undefined if no selection.
    var result = nodelist.filter(function (x) {
      return x.classList && x.classList.contains('selected')
    })
    return result.length ? result[0].id : undefined
  }
}

function run () {
  var game = new Game()
  game.changeState(game.states.options)
  document.getElementsByClassName('container')[0].addEventListener('click', game.click.bind(game), false)
}

// in case the document is already rendered
if (document.readyState !== 'loading') run()
// modern browsers
else if (document.addEventListener) document.addEventListener('DOMContentLoaded', run)
// IE <= 8
else document.attachEvent('onreadystatechange', function () {
  if (document.readyState === 'complete') run()
})
