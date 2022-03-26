import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
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
    case 'GET':
      const passport = await contract.balanceOf(req.session.siwe?.address);
      const isPassportOwner = passport.toNumber() > 0;
      req.session.isPassportOwner = isPassportOwner;
      await req.session.save();
      res.send({
        address: req.session.siwe?.address,
        isPassportOwner: req.session.isPassportOwner,
        });
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default withIronSessionApiRoute(handler, ironOptions)