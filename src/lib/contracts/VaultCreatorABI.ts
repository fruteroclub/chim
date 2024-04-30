export const VaultCreatorABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_vToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_manager',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_symbol',
        type: 'string',
      },
    ],
    name: 'NewVaultCreated',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_components',
        type: 'address[]',
      },
      {
        internalType: 'int256[]',
        name: '_units',
        type: 'int256[]',
      },
      {
        internalType: 'address',
        name: '_manager',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_symbol',
        type: 'string',
      },
    ],
    name: 'create',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
