export interface SafeTx {
	safe: string
	to: string
	value: number
	data: string
	operation: number
	gasToken: string
	safeTxGas: number
	baseGas: number
	gasPrice: number
	refundReceiver: string
	nonce?: number
	contractTransactionHash: string
	sender: string
	signature: string
	origin: string
}

export interface Assets {
	tokenAddress: string | null | undefined
	token: {
		name: string
		symbol: string
		decimals: number
		logoUri: string
	} | null | undefined
	balance: string
}