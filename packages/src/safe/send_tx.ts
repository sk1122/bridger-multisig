import { getTxData } from "@wagpay/sdk"
import { ChainId, CoinKey, Routes, wagpayBridge } from "@wagpay/types"
import axios from "axios"
import { ethers } from 'ethers'

import { SafeTx } from "../types"
import { is_native_token } from "../utils/is_native_token"
import { getBridge } from "./generate_tx"

export const tx_sign = async (chain: string, safe_address: string, safe_tx: SafeTx) => {
	const URL = `https://safe-transaction.${chain === 'ethereum' ? '' : (chain + '.')}gnosis.io/api/v1/safes/${safe_address}/multisig-transactions/`

	try {
		const res = await axios.post(URL, safe_tx)
	} catch (e: any) {
		if (e.response.data) {
			return e.response.data.nonFieldErrors[0].split("=")[1].split(" ")[0]
		} else {
			throw "Can't get contractTransactionHash"
		}
	}
}

export const send_tx = async (chain: string, safe_address: string, safe_tx: SafeTx) => {
	console.log(chain, safe_address, safe_tx)

	const URL = `https://safe-transaction.${chain === 'ethereum' ? '' : (chain + '.')}gnosis.io/api/v1/safes/${safe_address}/multisig-transactions/`

	try {
		const res = await axios.post(URL, safe_tx)

		const data = await res.data

		return data
	} catch (e: any) {
		throw e
	}
}

export const full_send_tx = async (route: Routes, chain: string, safe_address: string, user_address: string, signed_msg: string) => {
	// const tx_data = await getTxData(route)
	try {

		const tx_data = await getTxData(safe_address, route)

		const NONCE_URL = `https://safe-transaction.${chain === 'ethereum' ? '' : (chain + '.')}gnosis.io/api/v1/safes/${safe_address}`

		const nonce_res = await axios.get(NONCE_URL)
		console.log(nonce_res)
		const nonce_data = (await nonce_res.data).nonce

		let safe_tx: SafeTx = {
			"safe": safe_address,
			"to": wagpayBridge[Number(route.route.fromChain)],
			"value": is_native_token(route.route.fromToken.address) ? Number(route.route.amount) : 0,
			"data": tx_data as string,
			"operation": 0,
			"gasToken": "0x588C9929C7e6018E32f6Ad250E7abaecf106Ad7e",
			"safeTxGas": 0,
			"baseGas": 0,
			"gasPrice": 0,
			"nonce": nonce_data,
			"refundReceiver": user_address,
			"contractTransactionHash": "0x17934cb82ecd4a31dfcb1558713c5833bc1fb359a070c9b4f1f6997f5f32ca6",
			"sender": user_address,
			"signature": signed_msg,
			"origin": user_address
		}

		const contractTransactionHash = await tx_sign(chain, safe_address, safe_tx)

		safe_tx.contractTransactionHash = contractTransactionHash

		return send_tx(chain, safe_address, safe_tx)
	} catch (e: any) {
		throw e
	}
}

// getBridge(ChainId.POL, ChainId.ETH, CoinKey.USDC, CoinKey.USDT, '100000000')
// 	.then(route => {
// 		full_send_tx(route[0], 'polygon', '0x3975c7f2f64EA7660E8CBa40823e44f6C9a76d3d', '0x588C9929C7e6018E32f6Ad250E7abaecf106Ad7e', '0x50adc3ffc2cc8365627c0bd5f38d76a35ba41306c840f58cd76fab103a8232b2370627cbc1fbeac1a7981c6e08e3ce3d53dbbe0aa6f15902e316b8286deac67c1b')
// 			.then(res => console.log("res", res)).then((e: any) => console.log("full_send_tx", e))
// 	})
// 	.catch(e => console.log("getBridge", e.response.data))

// tx_sign('polygon', '0x3975c7f2f64EA7660E8CBa40823e44f6C9a76d3d', {
// 	"safe": "0x3975c7f2f64EA7660E8CBa40823e44f6C9a76d3d",
// 	"to": "0x588C9929C7e6018E32f6Ad250E7abaecf106Ad7e",
// 	"value": 0,
// 	"data": "0xe35fb34b000000000000000000000000000000000785ee10d5da46d900f436a000000000000000000000000000000000588c9929c7e6018e32f6ad250e7abaecf106ad7e0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000065741475041590000000000000000000000000000000000000000000000000000",
// 	"operation": 0,
// 	"gasToken": "0x588C9929C7e6018E32f6Ad250E7abaecf106Ad7e",
// 	"safeTxGas": 0,
// 	"baseGas": 0,
// 	"gasPrice": 0,
// 	"refundReceiver": "0x588C9929C7e6018E32f6Ad250E7abaecf106Ad7e",
// 	"contractTransactionHash": "0x17934cb82ecd4a31dfcb1558713c5833bc1fb359a070c9b4f1f6997f5f32ca6",
// 	"sender": "0x588C9929C7e6018E32f6Ad250E7abaecf106Ad7e",
// 	"signature": "0x39edafee96c601ba59aa2e55c843b1d1ae229cedf682438201650e578b5bde290255afb54db30c5b1979b1ff312b4ce6b6e152473dc27818fdeb8912ac1ccba21c",
// 	"origin": "0x588C9929C7e6018E32f6Ad250E7abaecf106Ad7e"
// })