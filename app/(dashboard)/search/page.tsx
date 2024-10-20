import { db } from '@/lib/db'
import { Categories } from './_components/categories';
import { SearchInput } from '@/components/search-input';
import { getCourses } from '@/actions/get-courses';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { CoursesList } from '@/components/courses-list';

interface SearchProps {
    searchParams: {
        title: string;
        categoryId: string;
    }
}

const Search = async ({
    searchParams,
}: SearchProps) => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/');
    }


    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        }
    });

    const courses = await getCourses({
        userId: user.id,
        ...searchParams,
    });



    return (
        <>
            <div className='px-6 pt-6 md:hidden md:mb-0 block'>
                <SearchInput />
            </div>
            <div className='p-6 space-y-4'>
                <Categories
                    items={categories}
                />
                <CoursesList
                    items={courses}
                />
            </div>
        </>
    )
}

export default Search