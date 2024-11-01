import classes from "./search.module.css";

export default function Search() {
  return (
    <search className={classes.search}>
      <form>
        <div className={classes["search-input-wrapper"]}>
          <img src="/search.svg" alt="" width={24} height={24} />
          <input
            type="search"
            id="search"
            name="search"
            placeholder="search Multipedia"
            className={classes["search-input"]}
          />
        </div>
      </form>
    </search>
  );
}
