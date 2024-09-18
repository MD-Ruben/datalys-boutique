'use client'
import React from 'react'
import Link from 'next/link'

import { Category } from '../../../../payload/payload-types'
import { useFilter } from '../../../_providers/Filter'

import classes from './index.module.scss'

type CategoryCardProps = {
  category: Category
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const { setCategoryFilters } = useFilter()

  // Vérification de l'existence de la propriété media avant d'accéder à media.url
  const mediaUrl = category.media ? (category.media as Media).url : null

  return (
    <Link
      href="/products"
      className={classes.card}
      style={{ backgroundImage: mediaUrl ? `url(${mediaUrl})` : 'none' }}
      onClick={() => setCategoryFilters([category.id])}
    >
      <p className={classes.title}>{category.title}</p>
    </Link>
  )
}

export default CategoryCard
