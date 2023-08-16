import React from "react";
import qs from "qs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectFilter, setCategoryId, setCurrentPage, setFilters,} from "../redux/slices/filterSlice";
import { fetchPizzas, selectPizzaData } from "../redux/slices/pizzaSlices";
import { list } from "../components/Sort";
import Categories from "../components/Categories";
import Sort from "../components/Sort";
import PizzaBlock from "../components/PizzaBlock";
import Skeleton from "../components/PizzaBlock/Skeleton";
import Pagination from "../components/Pagination";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);
  const { items, status } = useSelector(selectPizzaData);
  const { categoryId, sort, currentPage, searchValue } = useSelector(selectFilter);

  const [isLoading, setIsLoading] = React.useState(true);

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  const onChangePage = (number) => {
    dispatch(setCurrentPage(number));
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
          currentPage,
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
    const params = {
      categoryId: categoryId > 0 ? categoryId : null,
      sortProperty: sort.sortProperty, currentPage, 
    };
    

    const queryString = qs.stringify(params, { skipNulls: true });

    navigate(`/?${queryString}`);

    if (!window.location.search) {
      getPizzas();
    }

    isMounted.current = true;
  }, [categoryId, sort.sortProperty, searchValue, currentPage, navigate]);

  React.useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));

      const sortParam = list.find(
        (obj) => obj.sortProperty === params.sortProperty);

      dispatch(
        setFilters({
          ...params,
          sort: sortParam,
        })
      );
      isSearch.current = true;
    }
  }, [dispatch]);

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
          <Categories value={categoryId} onChangeCategory={onChangeCategory} />
          <Sort />
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
              {items.map((obj) => (
                <Link key={obj.id} to={`/pizza/${obj.id}`} >
                <PizzaBlock {...obj} />
                </Link>
              ))}
            </div>
          )}
        </div>
        <Pagination currentPage={currentPage} onChangePage={onChangePage} />
      </div>
    </>
  );
};

export default Home;
