import styled from '@emotion/styled'
import { Chevron, DoubleChevron } from '../assets/icon'

export default function Pages({
  handlePage,
  prevPage,
  nextPage,
  startPage,
  endPage,
  array,
  page,
}) {
  return (
    <Wrapper className='flex-between'>
      <button
        className={`${page === 0 ? 'disable' : 'none'}`}
        onClick={startPage}
      >
        <DoubleChevron />
      </button>
      <button onClick={prevPage}>
        <Chevron />
      </button>

      {array.map((item, index) => {
        return (
          <button
            key={index}
            style={{ pointerEvents: index === page && 'none' }}
            className={`${index === page ? 'active' : null}`}
            onClick={() => handlePage(index)}
          >
            {index + 1}
          </button>
        )
      })}
      <button onClick={nextPage}>
        <Chevron deg={180} />
      </button>
      <button
        onClick={endPage}
        className={`${page === array.length - 1 ? 'disable' : 'none'}`}
      >
        <DoubleChevron deg={180} />
      </button>
    </Wrapper>
  )
}

const Wrapper = styled('div')(() => ({
  background: 'rgba(84, 201, 255, 0.644)',
  bottom: '0',
  padding: '1rem',
  borderRadius: '10px',
  left: '50%',
  transform: 'translate(-50%,-40%)',
  position: 'fixed',
  zIndex: '100',
  maxWidth: '500px',
  margin: 'auto',
  display: 'flex',
  gap: '2rem',
  justifyContent: 'space-between',
  alignItems: 'center',
  button: {
    background: 'white',
    width: '2rem',
    height: '2rem',
    border: '1px solid var(--text-500)',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all .15s',
    ':hover': {
      background: '#ddd',
    },
    '*': {
      cursor: 'pointer',
    },
  },
  '.active': {
    background: 'var( --blue-telegram)',
  },
  '.disable': {
    background: 'var(--text-200)',
    opacity: '.5',
    pointerEvents: 'none',
  },
}))
