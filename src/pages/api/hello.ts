import type { NextApiRequest, NextApiResponse } from 'next';

type Greeting = {
	msg: string;
};

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Greeting>
) {
	res.status(200).json({ msg: 'hello' });
}
