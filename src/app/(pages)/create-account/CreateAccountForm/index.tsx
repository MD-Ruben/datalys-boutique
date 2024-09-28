'use client'

import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '../../../_components/Button'
import { Input } from '../../../_components/Input'
import { Message } from '../../../_components/Message'
import { useAuth } from '../../../_providers/Auth'

import classes from './index.module.scss'

type FormData = {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

const CreateAccountForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const { login } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>()

  const password = watch('password')

  const onSubmit = useCallback(
    async (data: FormData) => {
      setLoading(true) // Set loading state

      console.log('Submitting data:', data) // Log data to check structure

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const responseData = await response.json()

        if (!response.ok) {
          console.error('Server Error:', response.status, responseData) // Log error details
          setError(
            responseData?.message ||
              response.statusText ||
              "Une erreur s'est produite lors de la création du compte.",
          )
          setLoading(false)
          return
        }

        console.log('Success:', responseData) // Log successful response

        const redirect = searchParams.get('redirect')

        try {
          await login(data)
          if (redirect) router.push(redirect as string)
          else router.push(`/`)
          window.location.href = '/'
        } catch (loginError) {
          console.error('Login Error:', loginError) // Log login error
          setError(
            "Une erreur s'est produite avec les informations d'identification fournies. Veuillez réessayer.",
          )
        }
      } catch (fetchError) {
        console.error('Fetch Error:', fetchError) // Log fetch error
        setError('Une erreur réseau est survenue. Veuillez réessayer.')
      } finally {
        setLoading(false) // Reset loading state
      }
    },
    [login, router, searchParams],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <p>
        {`C'est ici que les nouveaux clients peuvent s'inscrire et créer un nouveau compte. Pour gérer tous les utilisateurs, `}
        <Link href="/admin/collections/users">se connecter au tableau de bord administratif</Link>
        {'.'}
      </p>
      <Message error={error} className={classes.message} />
      <Input
        name="email"
        label="Adresse e-mail"
        required
        register={register}
        error={errors.email}
        type="email"
      />
      <Input
        name="name"
        label="Nom complet"
        required
        register={register}
        error={errors.name}
        type="text"
      />
      <Input
        name="password"
        type="password"
        label="Mot de passe"
        required
        register={register}
        error={errors.password}
      />
      <Input
        name="passwordConfirm"
        type="password"
        label="Confirmer le mot de passe"
        required
        register={register}
        validate={value => value === password || 'Les mots de passe ne correspondent pas'}
        error={errors.passwordConfirm}
      />
      <Button
        type="submit"
        label={loading ? 'Processing' : "S'inscrire"}
        disabled={loading}
        appearance="primary"
        className={classes.submit}
      />
      <div>
        {'Vous avez déjà un compte ? '}
        <Link href={`/login${allParams}`}>Connexion</Link>
      </div>
    </form>
  )
}

export default CreateAccountForm
