import React from "react";
import { useDispatch } from "react-redux";
import { Sort, SortPropertyEnum } from "../redux/filter/types";
import { setSort } from "../redux/filter/slice";


type SortItem = {
  name: string;
  sortProperty: SortPropertyEnum;
};

type PopupCLick = MouseEvent & {
  path: Node [];
}

type SortPopupProps = {
  value: Sort;
}

 export const list: SortItem [] =[
  {name: 'популярности (DESC)', sortProperty: SortPropertyEnum.RATING_DESC },
  {name: 'популярности (ASC)', sortProperty: SortPropertyEnum.RATING_ASC },
  {name: 'цене (DESC)', sortProperty: SortPropertyEnum.PRICE_DESC },
  {name: 'цене (ASC)', sortProperty: SortPropertyEnum.PRICE_ASC },
  {name: 'алфавиту (DESC)', sortProperty: SortPropertyEnum.TITLE_DESC },
  {name: 'алфавиту (ASC)', sortProperty: SortPropertyEnum.TITLE_ASC},
 ];
 
 
  const SortPopup: React.FC<SortPopupProps> = React.memo( ({value}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const sortRef = React.useRef<HTMLDivElement>(null);

 const onClickListItem = (obj: SortItem) => {
  dispatch(setSort(obj))
  setOpen(false);
 }
  
 React.useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const _event = event as PopupCLick;
    

    if(sortRef.current && !_event.path.includes(sortRef.current))
     {
      setOpen(false);
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
          <span onClick={() => setOpen(!open)}>{value.name}</span>
        </div> 
        {open && (
        <div className="sort__popup">
          <ul>
            {list.map((obj, i) => (
              <li 
              key={i}
              onClick={() => onClickListItem(obj)}
              className={value.sortProperty === obj.sortProperty ? 'active' : ''}>
              {obj.name} 
              </li>
            ))}
          </ul>
        </div>
        )}
      </div>
    
  );
})

export default SortPopup;