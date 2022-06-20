import {ethers} from "ethers";
import React, {useEffect, useState} from "react";
import { useWeb3React } from "@web3-react/core";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import RESOLVER from "../config/build/contracts/Resolver.json"
import ERC20 from "../config/build/contracts/ERC20.json"
import ERC721 from "../config/contracts/ERC721.json"
import TOKENLIST from "../config/TOKENLIST.json"
import CONTROLLER from "../config/contracts/Controller.json"
import GAS_TANK from "../config/contracts/IGasTank.json"
import CONTROLLER_VIEW from "../config/contracts/ControllerView.json"

import {ROUTERS} from "../config/routers"
import { addresses } from "../config/addresses";
import { toFixed } from "./nft"

const goodToast = (msg) => {
    const ToastStyle = {
        borderRadius: "50px",
        color: "rgba(242, 242, 242, 0.87)",
        backdropFilter: "blur(12px) saturate(149%)",
        backgroundColor: "rgba(29, 30, 32, 0.87)",
        border: "2px solid rgba(251, 219, 55, 0.95)",
        padding: "0.42em",
        
    }

    const id = toast(`${msg}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        style: ToastStyle
    })
    toast.update(id, { render: `${msg}`, hideProgressBar: true, closeOnClick: true, position: "bottom-right", autoClose: 5000, className: 'rotateY animated', draggable: true})
}

export const writeContract = async (active, _signer, _account, _address, _abi) => {
    if (active) {
        try {
            const ctr = new ethers.Contract(_address, _abi, _signer)
            if (ctr.address) {
                return ctr
            } 
        } catch (err) {console.log(err)}
    }
}

async function fetchContract(address, abi, signer) {
    const contract = new ethers.Contract(address, abi, signer);
    console.log(`loaded contract ${contract.address}`);
    return contract;
  }


// ----------------------------------------------------------------------------------
// ///////////////////////////////// User Functions /////////////////////////////////
// ----------------------------------------------------------------------------------

async function approveStrategyWithERC20(tokenAddress, strategyAddress, amount, signer) {
    const erc20 = await fetchContract(tokenAddress, ERC20.abi, signer)
    return await erc20.approve(strategyAddress, amount);
  }
  
  // ----------------------------------------------------------------------------------
  
  async function approveControllerWithGasTank(signer) {
    const gasTank = await fetchContract(addresses.gasTank, GAS_TANK.abi, signer);
    return await gasTank.approve(addresses.controller, true);
  }
  
  // ----------------------------------------------------------------------------------
  
  async function depositGasTank(amount, signer) {
    const gasTank = await fetchContract(addresses.gasTank, GAS_TANK.abi, signer);
    return await gasTank.deposit(signer.address, amount);
  }
  
  // ----------------------------------------------------------------------------------
  
  async function withdrawGasTank(amount, signer) {
    const gasTank = await fetchContract(addresses.gasTank, GAS_TANK.abi, signer);
    return await gasTank.withdraw(amount);
  }

  // ----------------------------------------------------------------------------------

export async function withdraw(vaultId, tokenId, signer) {
    const controller = await fetchContract(addresses.vaults.controller, CONTROLLER.abi, signer);
    return await controller.withdraw(vaultId, tokenId);
  }
  
  // ----------------------------------------------------------------------------------
  
  var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  const getVaultIdByAddress = async (controller, address) => {
    const id = await controller.vaultId(address)
    return id
  }

  export const fetchOpenTradesByTokenId = async (controller, tokenId, vaultAddress) => {
      const vaultId = await getVaultIdByAddress(controller, vaultAddress) 
      const trades = await controller.viewOpenOrdersByToken(vaultId, tokenId)
      return trades
  }

  export async function vaultTokensByOwner(owner, signer) {
    
    const controllerView = await fetchContract(addresses.vaults.controllerView, CONTROLLER_VIEW.abi, signer);
    console.log("HANKEMUPS")
    console.log(controllerView)
    const vaultTokens = await controllerView.vaultTokensByOwner(owner);

    const vaults = [];
    for(const vault of vaultTokens) {
      const trades = await fetchOpenTradesByTokenId(controllerView, vault.tokenId.toNumber(), vault.vault)
        vaults.push({
            vault: vault.vault,
            tokenId: vault.tokenId.toNumber(),
            openTrades: [
              ...trades
            ]
        })
    }
    return vaults
  }

  export const matchTokenByAddress = (_tokenAddress) => {
    try {
      const token = TOKENLIST.tokens.filter( ( token ) => {
        return token.address.toLowerCase() === _tokenAddress.toLowerCase()
      })
      return token 
    } catch (err) {
      console.log(err)
      return null
    }

  }

  const sumArray = (_array) => {
    let n = 0;
    _array.forEach(i => {
        const number = parseFloat(i)
        n = n + number
    });

    return n.toString()
}

// export  const cleanPortfolioTotalData = (_portfolioData) => {
//   const totalOpen = _portfolioData.map( ( token ) => {
//     const amount = token.amount
//     const tokenPrice = token.erc20Meta.priceUSD
//     const tokenValue = amount * tokenPrice
//     //   const token = matchTokenByAddress(trade.address)
//     //   if (!token) {
//     //     return null
//     //   }
//     //   const decimals = token[0].decimals
//     //   const amount = rawAmount

//     //   return {
//     //     amount: amount,
//     //     token: token[0]
//     //   }
//     // })

//     // const justAmounts = totalOpen.map( ( open ) => {
//     //   return open.amount
//     // })
//     // const allTokenLogos = totalOpen.map( ( open ) => {
//     //   return open.token.logoURI
//     // })
//     // const totalValueOpen = sumArray(justAmounts)
//     // const amountOpen = justAmounts.length

//     return {
//       open: totalOpen,
//       totalValue: totalValueOpen,
//       tradeCount: amountOpen,
//       allTokenLogos: allTokenLogos
//     }
//   }
// }

export const userTotalValue = (strategyTokens) => {
  let totalValue = 0
  let count = 0
  strategyTokens.map( (strategyToken) => {
    strategyToken.erc20.map( (erc20) => {
      totalValue = totalValue + (erc20.amount * erc20.erc20Meta.priceUSD)
      count = count + 1
    })
    // const tokenAmount = token.amount
    // const tokenPrice = token.erc20Meta.priceUSD
    // totalValue = totalValue + (tokenAmount * tokenPrice)
    // console.log("userValue", tokenAmount, tokenPrice, totalValue)
  })
  return {
    totalValue: totalValue,
    count: strategyTokens.length
  }
}

export const cleanTradeData = (_tradeData) => {
  console.log("tradeData", _tradeData)
  const mappedData = _tradeData.map( (trades) => {
    const mappedTrade = trades.trades.map( (trade) => {

      const mappedOrders = trade.orders.map( (order) => {
        const matchedTokenIn = matchTokenByAddress(order.fromToken)
        const matchedTokenOut = matchTokenByAddress(order.toToken)
  
          return {
            id: order.id,
            fromToken: matchedTokenIn,
            toToken: matchedTokenOut,
            amountIn: order.amountIn,
            desiredAmountOut: order.desiredAmountOut,
            amountOut: order.amountOut,
            expiration: order.expiration,
            open: order.open,
            timestamp: order.timestamp
          }
        })
      return {
        id: trade.tradeId,
        orders: [...mappedOrders]
      }
    })
    
      
  return {
      strategy: trades.strategy,
      trades: mappedTrade,
      strategyId: trades.strategyId,
      tokenId: trades.tokenId
    }
  })
  return mappedData
}

export const viewTransaction = (txHash) => {
  return `https://polygonscan.com/tx/${txHash}`
}