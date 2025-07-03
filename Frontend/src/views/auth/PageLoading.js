import CircularProgress from '@mui/material/CircularProgress';

export default function PageLoading() {
  return (
    <section className="page-loading">
      <div className="wrapper color-p">
        <CircularProgress color="inherit" size={68} thickness={4} />
      </div>
    </section>
  );
}