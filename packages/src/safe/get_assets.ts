import axios from "axios"
import { Assets } from "../types"

export const get_assets = async (safe_address: string, chain: string): Promise<Assets[]> => {
	const URL = `https://safe-transaction.${chain === 'ethereum' ? '' : (chain + '.')}gnosis.io/api/v1/safes/${safe_address}/balances/?trusted=false&exclude_spam=false`

	const res = await axios.get(URL)
	const data = await res.data

	return data
}