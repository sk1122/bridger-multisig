import axios from 'axios'

export const get_safe = async (address: string, chain: string) => {
    const GNOSIS_URL = `https://safe-transaction.${chain === 'ethereum' ? '' : (chain + '.')}gnosis.io/api/v1/owners/${address}/safes/`

    console.log(GNOSIS_URL)

    const res = await axios.get(GNOSIS_URL)

    const data = await res.data

    console.log(data)

    return data
}
