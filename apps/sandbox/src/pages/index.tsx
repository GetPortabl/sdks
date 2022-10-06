import React from 'react';
import Link from 'next/link';

const IndexPage = () => (
  <div>
    <ul>
      <li>
        <Link href="vanilla">Vanilla</Link>
      </li>
      <li>
        <Link href="react">React</Link>
      </li>
    </ul>
  </div>
);

export default IndexPage;
