import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db'
import { createClient } from '@/utils/supabase/server'
import { LayoutDashboard } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'

import TitleForm from './_components/title-form';

async function CourseIdPage(
  { params }: { params: { courseId: string } }
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredField = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
  ];

  const totalField = requiredField.length;
  const completedField = requiredField.filter(Boolean).length;

  const completionText = `(${completedField}/${totalField})`;

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-y-2'>
          <h1 className='text-2xl font-medium'>Course setup</h1>
          <span className='text-sm text-foreground/60'>
            Complete all fields {completionText}
          </span>

        </div>

      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
        <div>
          <div className='flex items-center gap-x-2'>
            <IconBadge icon={LayoutDashboard} />
            <h2 className='text-xl'>Customize your course</h2>

          </div>
          <TitleForm 
            initialData={course}
            courseId={course.id}
          />
        </div>
      </div>
      </div>
  )
}

export default CourseIdPage