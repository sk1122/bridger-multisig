import { getRoutes } from "@wagpay/sdk"
import { ChainId, CoinKey } from "@wagpay/types"

export const getBridge = (fromChain: ChainId, toChain: ChainId, fromToken: CoinKey, toToken: CoinKey, amount: string) => {
	return getRoutes(
		{
			fromChain,
			toChain,
			fromToken,
			toToken,
			amount
		}
	)
}