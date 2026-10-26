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
              <span className="pill">{course.category || 'ONLINE COURSE'}</span>
              <h2>{course.name}</h2>
              <p className="muted">{course.description || 'Course access delivered through Telegram after verified payment.'}</p>
              <div className="price">₹{(course.pricePaise / 100).toLocaleString('en-IN')}</div>
              <Link className="btn" href={`/checkout/${course.slug}`}>Buy Now →</Link>
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
