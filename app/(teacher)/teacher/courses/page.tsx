import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'

const TeacherCourses = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  const courses = await db.course.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
      createdAt: "desc",
    }
  })

  return (
    <div className='p-6'>
      <DataTable columns={columns} data={courses} />
    </div>
  )
}

export default TeacherCourses