import React from "react";
import { useSelector, useDispatch, } from "react-redux";
import { selectSort, setSort } from '../redux/slices/filterSlice';

 export const list =[
  {name: 'популярности (DESC)', sortProperty: 'rating' },
  {name: 'популярности (ASC)', sortProperty: '-rating' },
  {name: 'цене (DESC)', sortProperty: 'price' },
  {name: 'цене (ASC)', sortProperty: '-price' },
  {name: 'алфавиту (DESC)', sortProperty: 'title' },
  {name: 'алфавиту (ASC)', sortProperty: '-title' },
 ];

  function Sort () {

  const dispatch = useDispatch();
  const sort = useSelector(selectSort);
  const [open, setOpen] = React.useState(false);
  const sortRef = React.useRef(null);

 const onClickListItem = (obj) => {
  dispatch(setSort(obj))
  setOpen(false);
 }
  
 React.useEffect(() => {
  console.log('sort mount')
  const handleClickOutside = (event) => {
    if(!sortRef.current.contains(event.target))
     {
      setOpen(false);
      console.log('click outside')
    }
  }
  document.body.addEventListener('click', handleClickOutside);

  return () => {
    console.log('sort unmount')
    document.body.removeEventListener('click', handleClickOutside);
  }
 }, []); 

  return ( 
    
      <div ref={sortRef} className="sort">
        <div className="sort__label">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 10 L50 50"
              fill="#2C2C2C"
            />
          </svg>
          <b>Сортировка по</b>
          <span onClick={() => setOpen(!open)}>{sort.name}</span>
        </div> 
        {open && (
        <div className="sort__popup">
          <ul>
            {list.map((obj, i) => (
              <li 
              key={i}
              onClick={() => onClickListItem(obj)}
              className={sort.sortProperty === obj.sortProperty ? 'active' : ''}>
              {obj.name} 
              </li>
            ))}
          </ul>
        </div>
        )}
      </div>
    
  );
}

export default Sort;