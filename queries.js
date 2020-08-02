const Pool = require('pg').Pool
const pool = new Pool({
  user: 'task',
  host: 'localhost',
  database: 'wallet',
  password: 'password',
  port: 5432,
})

const getWallets = (request, response) => {
  pool.query('SELECT * FROM wallet ORDER BY wallet_id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getWalletById = (request, response) => {
  const id = request.params.id 

  pool.query('SELECT T.wallet_id, T.amount, T.created, TT.typename FROM transaction T LEFT JOIN transactiontype TT ON T.transactiontype_id = TT.transactiontype_id WHERE wallet_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createWallet = (request, response) => {
  const { wallet_id, playername, funds } = request.body
  
    pool.query('SELECT wallet_id FROM wallet WHERE wallet_id = $1', [wallet_id], (error, results) => {
    if (error) {
      throw error
    }
		
	if (results.rowCount > 0) {
		response.status(200).send('User with ID: ' +  wallet_id + ' already exists')
		return
	}

	pool.query('INSERT INTO wallet (wallet_id, playername, created, funds) VALUES ($1, $2, current_timestamp, $3)', [wallet_id, playername, funds], (error, results) => {
	  if (error) {
	    throw error
	  }
	  response.status(201).send('Added wallet with ID: ' + wallet_id)
	})
  })
}


const depositFunds = (request, response) => {
  const id = request.params.id 
  const { funds } = request.body

  pool.query('SELECT funds FROM wallet WHERE wallet_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }

    total = parseInt(results.rows[0].funds) + parseInt(funds)
	
	pool.query(
    'UPDATE wallet SET funds = $1 WHERE wallet_id = $2',
    [total, id],
    (error, results) => {
      if (error) {
        throw error
      }
	  	pool.query(
		'INSERT INTO transaction (wallet_id, amount, created, transactiontype_id) VALUES ($1, $2, current_timestamp, 1)',
		[id, funds],
		(error, results) => {
		  if (error) {
			throw error
		  }
		  
		  response.status(200).send('Deposited ' + funds + ' funds for the player with ID ' + id)
		})

    })
	
  })
}

const withdrawFunds = (request, response) => {
  const id = request.params.id 
  const { funds } = request.body


  pool.query('SELECT funds FROM wallet WHERE wallet_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }

    total = parseInt(results.rows[0].funds) - parseInt(funds)
	
	if (total < 0)
	{
		response.status(200).send('Not enough founds on wallet with ID: ${id}')
		return
	}
	
	pool.query(
    'UPDATE wallet SET funds = $1 WHERE wallet_id = $2',
    [total, id],
    (error, results) => {
      if (error) {
        throw error
      }
	  	pool.query(
		'INSERT INTO transaction (wallet_id, amount, created, transactiontype_id) VALUES ($1, $2, current_timestamp, 2)',
		[id, funds],
		(error, results) => {
		  if (error) {
			throw error
		  }
		  
		  response.status(200).send('Deposited ' + funds + ' funds for the player with ID ' + id)
		})

    })
	
  })
}

module.exports = {
  getWallets,
  getWalletById,
  createWallet,
  depositFunds,
  withdrawFunds,
}
