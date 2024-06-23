import { BasicIDL } from '@ny-sol-dapp-test/anchor';

export default async function Index() {
  return (
    <div>
      <pre>{JSON.stringify(BasicIDL, null, 2)}</pre>
    </div>
  );
}
