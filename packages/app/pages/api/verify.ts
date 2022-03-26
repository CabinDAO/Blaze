import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { SiweMessage } from 'siwe';
import { ironOptions } from '@/constants';
import  { Contract, ethers } from "ethers";

const provider = new ethers.providers.AlchemyProvider("rinkeby", process.env.NEXT_PUBLIC_ALCHEMY_KEY);
const abi = ["function balanceOf(address owner) view returns (uint balance)"]
const contract = new Contract(
  "0xadC637aa19edf5e9ED8088785D5C367248962A5a",
  abi,
  provider
);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  const { method } = req
  switch (method) {
    case 'POST':
      try {
        const { message, signature } = req.body
        const siweMessage = new SiweMessage(message)
        const fields = await siweMessage.validate(signature)
        const passport = await contract.balanceOf(fields.address);
        if (fields.nonce !== req.session.nonce)
          return res.status(422).json({ message: 'Invalid nonce.' })

        req.session.siwe = fields
        const isPassportOwner = passport.toNumber() > 0;
        req.session.isPassportOwner = isPassportOwner; 
        await req.session.save()
        res.json({ ok: true })
      } catch (_error: any) {
        res.json({ ok: false })
      }
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default withIronSessionApiRoute(handler, ironOptions)