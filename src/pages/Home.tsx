import React from "react";
import qs from "qs";
import {useSelector } from "react-redux";
import {useNavigate } from "react-router-dom";
import { list } from "../components/Sort";
import Categories from "../components/Categories";
import Sort from "../components/Sort";
import PizzaBlock from "../components/PizzaBlock";
import Skeleton from "../components/PizzaBlock/Skeleton";
import Pagination from "../components/Pagination";
import {useAppDispatch } from "../redux/store";
import { selectFilter } from "../redux/filter/selectors";
import { selectPizzaData } from "../redux/pizza/selectors";
import { setCategoryId, setCurrentPage, setFilters } from "../redux/filter/slice";
import { fetchPizzas } from "../redux/pizza/asyncActions";
import { SearchPizzasParams } from "../redux/pizza/types";


const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);
  const { items, status } = useSelector(selectPizzaData);
  const { categoryId, sort, currentPage, searchValue } = useSelector(selectFilter);

  const [isLoading, setIsLoading] = React.useState(true);

  const onChangeCategory = React.useCallback((idx: number) => {
    dispatch(setCategoryId(idx));
  }, []);

  const onChangePage = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const getPizzas = async () => {
    const sortBy = sort.sortProperty.replace("-", "");
    const order = sort.sortProperty.includes("-") ? "asc" : "desc";
    const category = categoryId > 0 ? `category=${categoryId}` : "";
    const search = searchValue ? `&search=${searchValue}` : "";

    try {
      dispatch(
        fetchPizzas({
          sortBy,
          order,
          category,
          search,
          currentPage: String(currentPage),
        })
      );
    } catch (error) {
      console.log("ERROR", error);
      alert("Ошибка при получении пицц");
    } finally {
      setIsLoading(false);
    }
    window.scrollTo(0, 0);
  };

  React.useEffect(() => {
    if(isMounted.current) {
    const params = {
      categoryId: categoryId > 0 ? categoryId : null,
      sortProperty: sort.sortProperty, currentPage, 
    };
    

    const queryString = qs.stringify(params, { skipNulls: true });

    navigate(`/?${queryString}`);

    if (!window.location.search) {
      dispatch(fetchPizzas({} as SearchPizzasParams));
    } 

  } [categoryId, sort.sortProperty, searchValue, currentPage]});


  // React.useEffect(() => {
  //    if (isMounted.current) {
  //      const params = {
  //        categoryId: categoryId > 0 ? categoryId : null,
  //        sortProperty: sort.sortProperty,
  //        currentPage,
  //      };

  //      const queryString = qs.stringify(params, { skipNulls: true });

  //      navigate(`/?${queryString}`);
  //    }

  //    const params = qs.parse(window.location.search.substring(1)) as unknown as SearchPizzasParams;
  //    const sortObj = list.find((obj: { sortProperty: string; }) => obj.sortProperty === params.sortBy);
  //    dispatch(
  //      setFilters({
  //        searchValue: params.search,
  //        categoryId: Number(params.category),
  //        currentPage: Number(params.currentPage),
  //        sort: sortObj || list[0],
  //      }),
  //    );

  //   getPizzas();
  //    isMounted.current = true;
  // }, [categoryId, sort.sortProperty, searchValue, currentPage]);


  React.useEffect(() => {
    getPizzas();
  }, [categoryId, sort.sortProperty, searchValue, currentPage])

  React.useEffect(() => {
    
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1)) as unknown as SearchPizzasParams;
      const sort = list.find((obj) => obj.sortProperty === params.sortBy);
      dispatch(
        setFilters({
          searchValue: params.search,
          categoryId: Number(params.category),
          currentPage: Number(params.currentPage),
          sort: sort || list[0],
        }));
      isMounted.current = true;
    }
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);

    if (!isSearch.current) {
      getPizzas();
    }

    isSearch.current = false;
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  return (
    <>
      <div className="container">
        <div className="content__top">
          <Categories value={categoryId} 
          onChangeCategory={onChangeCategory}
          />
          <Sort value={sort} />
        </div>
        <h2 className="content__title">Все пиццы</h2>
        {status === "error" ? (
          <div className="content__error-info">
            <h2>Произошла ошибка</h2>
            <p>
              К сожалению, не удалось получить пиццы. Попробуйте повторить
              попытку позже.
            </p>
          </div>
        ) : null}
        <div className="content__items">
          {status === "loading" ? (
            [...new Array(6)].map((_, index) => <Skeleton key={index} />)
          ) : (
            <div>
              {items.map((obj: any) => (
                <PizzaBlock key={obj.id} {...obj} />))}
            </div>
          )}
        </div>
        <Pagination currentPage={currentPage} onChangePage={onChangePage} />
      </div>
    </>
  );
};

export default Home;
