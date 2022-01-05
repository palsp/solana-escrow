export const confirmTransaction = ({ connection }, txid, notify, cb) => {
  notify.info();
  connection.onSignature(txid, (signatureResult, _context) => {
    if (!signatureResult.err) {
      notify.success(txid);
    } else {
      notify.error(signatureResult.err);
    }
    if (cb) cb();
  });
};

export const getTxExplorerUrl = (txId) => {
  // TODO: support others cluster
  return `https://explorer.solana.com/tx/${txId}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`;
};
