interface NoDataProps {
  colSpan?: number;
}

const NoData: React.FC<NoDataProps> = ({ colSpan = 10 }) => {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-12 text-center text-sm text-text-tertiary"
      >
        No data found
      </td>
    </tr>
  );
};

export default NoData;
