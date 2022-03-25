import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { SiweMessage } from 'siwe';
import { ironOptions } from '@/constants';
import { erc721ABI } from "wagmi";
import ethers, { Contract } from "ethers";


export const contract = new Contract(
  "0xadC637aa19edf5e9ED8088785D5C367248962A5a",
  erc721ABI,
  new ethers.providers.AlchemyProvider("rinkeby", process.env.ALCHEMY_API_KEY)
);


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req
  switch (method) {
    case 'POST':
      try {
        const { message, signature } = req.body
        const siweMessage = new SiweMessage(message)
        const fields = await siweMessage.validate(signature)

        if (fields.nonce !== req.session.nonce)
          return res.status(422).json({ message: 'Invalid nonce.' })

        req.session.siwe = fields
        req.session.isPassportOwner = await contract.balanceOf(fields.address) > 0;
        await req.session.save()
        res.json({ ok: true })
      } catch (_error) {
        res.json({ ok: false })
      }
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default withIronSessionApiRoute(handler, ironOptions)