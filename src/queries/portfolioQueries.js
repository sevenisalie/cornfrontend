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