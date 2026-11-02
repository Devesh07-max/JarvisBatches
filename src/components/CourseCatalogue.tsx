'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

type Course = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  pricePaise: number;
};

export default function CourseCatalogue({ courses }: { courses: Course[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(courses.map((course) => course.category?.trim()).filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b))],
    [courses],
  );

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return courses.filter((course) => {
      const searchableText = `${course.name} ${course.category ?? ''} ${course.description ?? ''}`.toLocaleLowerCase();
      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
      const matchesCategory = category === 'All' || course.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [courses, query, category]);

  return (
    <>
      <div className="catalogue-tools" role="search">
        <label className="search-box">
          <span aria-hidden="true" className="search-icon">⌕</span>
          <span className="sr-only">Search courses</span>
          <input
            id="course-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by course, subject or topic..."
            type="search"
            aria-label="Search courses by name, subject or topic"
          />
          {query && <button className="clear-search" type="button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
        </label>
        <label className="category-filter">
          <span className="sr-only">Filter by category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter courses by category">
            {categories.map((item) => <option key={item} value={item}>{item === 'All' ? 'All subjects' : item}</option>)}
          </select>
        </label>
      </div>

      <p className="search-count" aria-live="polite">
        {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
        {(query || category !== 'All') && <button type="button" className="reset-filters" onClick={() => { setQuery(''); setCategory('All'); }}>Clear filters</button>}
      </p>

      {filteredCourses.length ? (
        <div className="grid">
          {filteredCourses.map((course) => (
            <article className="card course-card" key={course._id}>
              {course.imageUrl ? <img className="course-image" src={course.imageUrl} alt={course.name} loading="lazy" /> : <div className="course-placeholder" aria-label="Course image not added">📚</div>}
              <div className="course-card-body">
               <span className="course-category">{course.category || 'JARVIS BATCH'}</span>
               <h2>{course.name}</h2>
               <p className="course-description-short">{course.description || 'Explore course details and start your preparation.'}</p>
               <div className="course-card-bottom"><div><small>COURSE PRICE</small><strong>₹{(course.pricePaise / 100).toLocaleString('en-IN')}</strong></div><Link className="btn btn-card" href={`/checkout/${course.slug}`}>Enroll Now <b>→</b></Link></div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card empty-search">
          <div className="empty-search-icon">⌕</div>
          <h2>No matching courses found</h2>
          <p className="muted">Try another course name or subject, or clear your filters.</p>
          <button className="btn" type="button" onClick={() => { setQuery(''); setCategory('All'); }}>Show all courses</button>
        </div>
      )}
    </>
  );
}
