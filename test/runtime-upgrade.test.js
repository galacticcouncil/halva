
const fs = require('fs');
const testKeyring = require('@polkadot/keyring/testing');

describe('HydraDX-node', () => {
  describe('Runtime upgrades', () => {
    it('Runtime upgrade to version 2 should work', async () => {
      const wasmFilePath = './specs/spec_2.wasm'; //path to wasm file
      const expectedFromSpecVersion = 1; //expected deployed version before upgrade
      const expectedToSpecVersion = 2;   //expected spec version after successfull upgrade

      const currentSpecVersion = (await halva.polkadot.rpc.state.getRuntimeVersion()).specVersion.toNumber();

      assert.strictEqual(currentSpecVersion, expectedFromSpecVersion, `Invalid deployed chain version. Expected deployed version is ${expectedFromSpecVersion}, current deployed version is ${currentSpecVersion}.`);

      const sudoId = await halva.polkadot.query.sudo.key();

      const sudoPair = testKeyring.createTestKeyring().getPair(sudoId.toString())

      const proposal = halva.polkadot.tx.system.setCode(`0x${fs.readFileSync(wasmFilePath).toString('hex')}`);

      const tx = halva.polkadot.tx.sudo.sudoUncheckedWeight(proposal, 0);

      await passes(tx, 'Send', sudoPair);
      
      const upgradedSpecVersion = (await halva.polkadot.rpc.state.getRuntimeVersion()).specVersion.toNumber();
      assert.strictEqual(upgradedSpecVersion, expectedToSpecVersion, `Runtime upgrade failed. Chain reported version is ${upgradedSpecVersion}, expected chain version is ${expectedToSpecVersion}.`);
    });
  });
});
