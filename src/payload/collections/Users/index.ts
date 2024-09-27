import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import { anyone } from '../../access/anyone'
import adminsAndUser from './access/adminsAndUser'
import { checkRole } from './checkRole'
// import { customerProxy } from './endpoints/customer'
// import { createStripeCustomer } from './hooks/createStripeCustomer'
import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'
// import { loginAfterCreate } from './hooks/loginAfterCreate'
// import { resolveDuplicatePurchases } from './hooks/resolveDuplicatePurchases'
// import { CustomerSelect } from './ui/CustomerSelect'

const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email'],
  },
  access: {
    read: adminsAndUser,
    create: anyone,
    update: adminsAndUser,
    delete: admins,
    admin: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    //beforeChange: [createStripeCustomer],
    //afterChange: [loginAfterCreate],
  },
  auth: true,
  // endpoints: [
  //   {
  //     path: '/:teamID/customer',
  //     method: 'get',
  //     handler: customerProxy,
  //   },
  //   {
  //     path: '/:teamID/customer',
  //     method: 'patch',
  //     handler: customerProxy,
  //   },
  // ],
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true, // Ajoutez ceci si vous souhaitez que le nom d'utilisateur soit unique
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['customer'],
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'customer',
          value: 'customer',
        },
      ],
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      access: {
        read: admins,
        create: admins,
        update: admins,
      },
    },
    // {
    //   name: 'purchases',
    //   label: 'Purchases',
    //   type: 'relationship',
    //   relationTo: 'products',
    //   hasMany: true,
    //   hooks: {
    //     beforeChange: [resolveDuplicatePurchases],
    //   },
    // },
    // {
    //   name: 'stripeCustomerID',
    //   label: 'Stripe Customer',
    //   type: 'text',
    //   access: {
    //     read: ({ req: { user } }) => checkRole(['admin'], user),
    //   },
    //   admin: {
    //     position: 'sidebar',
    //     components: {
    //       Field: CustomerSelect,
    //     },
    //   },
    // },
    // ... autres champs
  ],
  timestamps: true,
}

export default Users
