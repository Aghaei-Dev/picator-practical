import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Input, InputAdornment, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'

import { SearchOutlinedIcon } from './assets/icon'
import { Photo, SelectColor, Loading, Pages } from './components'

import { paginate, saveLocal } from './func'
import { searchUrl, clientID, baseUrl } from './assets/constant'

export default function App() {
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)
  const resize = () => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
  }
  useEffect(() => {
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [width, height])

  const [y, setY] = useState(window.scrollY)
  const handleNavigation = useCallback(
    (e) => {
      const window = e.currentTarget

      setY(window.scrollY)
    },
    [y]
  )

  useEffect(() => {
    setY(window.scrollY)
    window.addEventListener('scroll', handleNavigation)
    return () => {
      window.removeEventListener('scroll', handleNavigation)
    }
  }, [handleNavigation])

  const [color, setColor] = useState(saveLocal('color'))

  // =========== Home images functionality ===========
  const [homeLoading, setHomeLoading] = useState(false)
  const [photos, setPhotos] = useState([])
  const [page, setPage] = useState(saveLocal('page'))
  const [query, setQuery] = useState(saveLocal('query'))
  const [newImages, setNewImages] = useState(false)
  const [found, setFound] = useState({
    text: 'found',
    number: 0,
    show: false,
  })

  const mounted = useRef(false)

  const fetchImages = async () => {
    setHomeLoading(true)
    let url
    const urlPage = `&page=${page}`
    const urlQuery = `&query=${query}`
    if (query) {
      if (color) {
        const urlColor = `&color=${color}`
        url = `${searchUrl}${clientID}${urlPage}${urlQuery}${urlColor}`
      } else {
        url = `${searchUrl}${clientID}${urlPage}${urlQuery}`
      }
    } else {
      url = `${baseUrl}photos/${clientID}${urlPage}`
    }
    const response = await fetch(url)
    const data = await response.json()

    setPhotos((oldPhotos) => {
      if (query && page === 1) {
        setFound({ show: true, number: data.total, text: 'found' })
        return data.results
      } else if (query) {
        const ph = [...oldPhotos, ...data.results]
        setFound({
          show: true,
          number: data.total - ph.length,
          text: 'remain',
        })
        if (ph.length === data.total) {
          setNewImages(false)
          setHomeLoading(false)
        }
        return ph
      } else {
        return [...oldPhotos, ...data]
      }
    })
    setNewImages(false)
    setHomeLoading(false)
  }

  useEffect(() => {
    fetchImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    localStorage.setItem('query', JSON.stringify(query))
    localStorage.setItem('page', JSON.stringify(page))
    localStorage.setItem('color', JSON.stringify(color))
  }, [query, page, color])

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    if (!newImages) return
    if (homeLoading) return
    setPage((oldPage) => oldPage + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newImages])

  const event = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      setNewImages(true)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', event)
    return () => window.removeEventListener('scroll', event)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query) return
    if (page === 1) {
      fetchImages()
    }
    setPage(1)
  }

  const startPage = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const endPage = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    })
  }
  const handlePage = (number) => {
    window.scrollTo({
      top: number * 3700,
      behavior: 'smooth',
    })
  }
  const prevPage = () => {
    if (y - 3700 >= 0) {
      window.scrollTo({
        top: y - 3700,
        behavior: 'smooth',
      })
    }
  }

  const nextPage = () => {
    window.scrollTo({
      top: y + 3700,
      behavior: 'smooth',
    })
  }

  return (
    <main>
      <SearchWrapper>
        <h2>photo finder</h2>
        <form>
          <Input
            className='form-input'
            id='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton type='submit' onClick={handleSubmit}>
                  <SearchOutlinedIcon />
                </IconButton>
              </InputAdornment>
            }
          />
          <div className='flex'>
            <SelectColor color={color} setColor={setColor} />
          </div>
        </form>
      </SearchWrapper>
      <Pages
        array={paginate(photos)}
        startPage={startPage}
        endPage={endPage}
        handlePage={handlePage}
        prevPage={prevPage}
        nextPage={nextPage}
      />
      <PhotosWrapper width={width}>
        {found.show && (
          <span className='found'>
            result {found.number.toLocaleString()} {found.text}
          </span>
        )}
        <div className='photos-center'>
          <div className='col'>
            {photos.map((image, index) => {
              return (
                index % 2 === 0 && (
                  <Photo key={index} {...image} width={width} />
                )
              )
            })}
          </div>
          {width > 800 && (
            <div className='col'>
              {photos.map((image, index) => {
                return (
                  index % 2 !== 0 && (
                    <Photo key={index} {...image} width={width} />
                  )
                )
              })}
            </div>
          )}
        </div>

        {homeLoading && <Loading />}
      </PhotosWrapper>
    </main>
  )
}

const SearchWrapper = styled('div')(() => ({
  padding: '5rem 0 0 0',
  width: '90vw',
  maxWidth: 'var(--max-width)',
  margin: '0 auto',
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'baseline',
    '.select': {
      marginTop: ' 1rem',
      width: '150px !important',
    },
  },
  '.form-input': {
    width: '100%',
    maxWidth: '500px',
    marginTop: '1rem',
    padding: '0.5rem 0rem',
    letterSpacing: 'var(--spacing) !important',
    fontSize: ' 1.5rem !important',
    color: 'var(--clr-grey-5)',
    backgroundColor: 'transparent',
  },
  '.flex': {
    // background: 'red',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
  },
}))

const PhotosWrapper = styled('div')(({ width }) => ({
  padding: '5rem 0',
  '.found': {
    background: 'rgba(255, 255, 255, 0.5)',
    position: 'fixed',
    top: '0',
    padding: ' 0.3rem 0.5rem',
    textTransform: 'capitalize',
    zIndex: '10',
  },
  '.photos-center': {
    width: '90vw',
    maxWidth: 'var(--max-width)',
    margin: ' 0 auto',
    display: 'grid',
    gridTemplateColumns: width > 800 ? '1fr 1fr' : '1fr',
    gap: '2rem',
    'div.col': {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
    },
  },
}))
