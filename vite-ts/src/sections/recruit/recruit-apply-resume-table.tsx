import { useState, useEffect } from 'react';

import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import Pagination, {paginationClasses} from '@mui/material/Pagination';

import { useGetResumeList } from 'src/api/mypageResume';

import Scrollbar from 'src/components/scrollbar';
import { SplashScreen } from 'src/components/loading-screen';
import {
  useTable,
  getComparator,
  TableHeadCustom,
} from 'src/components/table';

// ----------------------------------------------------------------------

type RowDataType = {
  title: string;
  createdAt: string;
  updatedAt: string;
  pk: number;
};

const TABLE_HEAD = [
  { id: 'title', label: '이력서 제목', align: 'left', minWidth: '150px' },
  { id: 'createdAt', label: '생성일', align: 'center', minWidth: '150px' },
  { id: 'updatedAt', label: '수정일', align: 'center', minWidth: '120px' },
  { id: 'button', label: '', align: 'center', minWidth: '120px' },
];

// ----------------------------------------------------------------------

export default function SortingSelectingTable() {
  const table = useTable({
    defaultOrderBy: 'createdAt',
  });

  const [tableData, setTableData] = useState<RowDataType[]>([]);

  const { resumesData, resumesLoading, resumesError } = useGetResumeList({
    searchType: '',
    searchWord: '',
    sortType: '',
    sort: ''
  });

  useEffect(() => {
    if (resumesData && resumesData.getResumesResponse) {
      const data = resumesData.getResumesResponse.map((item) => ({
        pk: item.resumeId,
        title: item.resumeTitle,
        createdAt: item.createdAt.slice(0, 10),
        updatedAt: item.updatedAt.slice(0, 10)
      }));
      setTableData(data);
    }
  }, [resumesData]);
  // 조건 랜더
  const renderResumeList = () => {
    if (resumesLoading) {
      return <SplashScreen />;
    }

    if (resumesError) {
      return <Typography sx={{ textAlign: 'center', mt: 4 }}>잘못된 접근입니다.</Typography>;
    }

    if (!resumesData.totalPage) {
      return <Typography sx={{ textAlign: 'center', mt: 4 }}>이력서가 없습니다.</Typography>;
    }
    return (
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size="medium" sx={{ minWidth: 800 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={dataFiltered.length}
              onSort={table.onSort}
            />

            <TableBody>
              {dataFiltered.slice((page - 1) * pageCount, page * pageCount).map((row) => (
                <TableRow
                  hover
                  key={row.pk}
                >
                  <TableCell> {row.title} </TableCell>
                  <TableCell align="center">{row.createdAt}</TableCell>
                  <TableCell align="center">{row.updatedAt}</TableCell>
                  <TableCell align="center">
                    <Button variant="outlined" onClick={() => handlePreviewClick(row.pk)}>
                      미리보기
                    </Button>
                    <Button variant="contained" color="primary" sx={{ ml: 1 }} onClick={() => handleSelectClick(row.pk)}>
                      선택하기
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    )

  }


  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  const handlePreviewClick = (pk: number) => {
    console.log('미리보기 클릭:', pk);
    // 미리보기 클릭 시 수행할 작업 추가
  };

  const handleSelectClick = (pk: number) => {
    console.log('선택하기 클릭:', pk);
    // 선택하기 클릭 시 수행할 작업 추가
  };

  // 페이지네이션
  const pageCount = 7
  const [page, setPage] = useState<number>(1)
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <>
      {renderResumeList()}
        <Pagination
          page={page}
          onChange={handleChange}
          count={Math.floor((resumesData.totalPage - 1) / pageCount) + 1}
          defaultPage={1}
          siblingCount={1}
          sx={{
            mt: 3,
            mb: 3,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
}: {
  inputData: RowDataType[];
  comparator: (a: any, b: any) => number;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}