import React from 'react'

import { Button } from '@/components/ui/button'

export default function SecondaryBtn(props: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant={'outline'}
      className="p-6 w-full shrink" 
      {...props}
    />
  )
}
