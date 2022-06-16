import { request, gql } from "graphql-request"

export const portfolioGraphRequest = (_account) => {
    const portfolioByUserQuery = gql`
    {
        users(where: {id: "${_account.toLowerCase()}"}, first: 100) {
            strategyTokens(where: {open: true}) {
                strategyId
                tokenId
                erc20 {
                    address
                    amount
                }
                trades {
                    tradeId
                    orders {
                        orderId
                        fromToken
                        toToken
                        amountIn
                        desiredAmountOut
                        amountOut
                        expiration
                        open
                        timestamp
                    }
                }
            }
        }
    }
    `
    return portfolioByUserQuery
}

export const portfolioTotalsGraphQuery = (_account) => {
    const query = gql`
    {
        erc20S(where: {owner: "${_account.toLowerCase()}", amount_not: 0}) {
          address
          amount
        }
      }
    `
    return query
}


export const gasTankQuery = (_account) => {
    const data = gql`
    {
        payers(where: {id: "${_account}"}) {
          id
          amountDeposited
          totalAmountSpent
          payees {
            payee {
              id
            }
            approved
          }
        }
      }
    `
    return data
}


export const masterChefQuery = () => {
    return gql`
    {
        masterchefs {
            id
            poolCount
            cobPerBlock
            userCount
            tvl
            totalAllocationPoints
        }
        pools {
            id
            token
            name
            symbol
            decimals
            lp
            userCount
            totalDeposited
            priceUSD
            tvl
            allocationPoint
            apy
            depositFee
            timestamp
        }
    }`
}

export const masterChefUserQuery = (_account) => {
    return gql`{
        poolUsers(where: {user: "${_account.toLowerCase()}"}) {
            pool {
                id
                priceUSD
            }
            depositAmount
        }
    }`
}