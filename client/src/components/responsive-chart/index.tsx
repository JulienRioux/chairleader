/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import * as React from 'react';
import { useState, useCallback } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Tooltip,
  Legend,
  Label,
  Bar,
  Cell,
} from 'recharts';
import moment from 'moment';
import { isNil } from 'lodash';
import styled, { useTheme } from 'styled-components';

const fixDecimal = (amount: any) =>
  typeof amount === 'number' ? Number(amount?.toFixed(6)) : 0;

const secondaryColor = '#ff0000';

const ChartTitle = styled.h3`
  font-size: 24px;
  margin: 0;
`;

const TitleWrapper = styled.div`
  margin: 0 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const Title = styled.h2`
  margin: 0 0 48px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SubTitle = styled.h5`
  margin: 20px 0 0px 0;
  opacity: 0.6;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  max-height: 27px;
  line-height: 2;
`;

const DEFAULT_Y_AXIS_PADDING = '20';

const CustomTooltip = () => null;

const TRANSITION_DURATION = '0.3s';

const ResponsiveBarChart = ({
  data,
  xDataKey,
  yDataKey,
  AXIS_COLOR,
  tooltipLabelOverride = (str: string) => str,
  title,
  subTitle,
  showDollarSign,
}: {
  data: any;
  xDataKey: any;
  yDataKey: any;
  AXIS_COLOR: any;
  tooltipLabelOverride?: any;
  title: any;
  subTitle: any;
  showDollarSign?: boolean;
}) => {
  const [activeLabel, setActiveLabel] = useState(null);
  const [activeValue, setActiveValue] = useState(null);
  const [activeTooltipIndex, setActiveTooltipIndex] = useState(null);

  const theme = useTheme();

  const handleMouseMove = useCallback(
    (e: any) => {
      setActiveLabel(e?.activeLabel);
      const activePayload = e?.activePayload;
      if (activePayload) {
        setActiveValue(activePayload[0]?.value);
      }
      setActiveTooltipIndex(e?.activeTooltipIndex);
    },
    [activeLabel]
  );

  const handleMouseLeave = useCallback(() => {
    setActiveLabel(null);
    setActiveValue(null);
    setActiveTooltipIndex(null);
  }, []);

  const tooltipIsActive = !isNil(activeTooltipIndex);

  // Use only one color if we're displaying more than 24 data in a single chart
  // const isBiColor = data.length <= 30;
  const isBiColor = false;

  const activeLabelText =
    tooltipLabelOverride(activeLabel) || 'Move your cursor on the dataset.';

  return (
    <>
      <SubTitle>{tooltipIsActive ? activeLabelText : subTitle}</SubTitle>
      <Title>
        {tooltipIsActive
          ? `${showDollarSign ? '$' : ''}${
              activeValue ? `${activeValue}` : '0'
            }`
          : title}
      </Title>

      <ResponsiveContainer width="100%" aspect={3}>
        <BarChart
          data={data}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => console.log(e)}
          style={{ transition: TRANSITION_DURATION }}
        >
          <CartesianGrid
            stroke={theme.color.lightGrey}
            vertical={false}
            style={{
              opacity: tooltipIsActive ? 0 : 1,
              transition: TRANSITION_DURATION,
            }}
          />
          <XAxis
            dataKey={xDataKey}
            stroke={AXIS_COLOR}
            axisLine={{ stroke: theme.color.lightGrey }}
            tickLine={false}
          />
          <YAxis
            stroke={AXIS_COLOR}
            tick={{ fill: AXIS_COLOR }}
            // tickLine={{ stroke: 'transparent' }}
            tickLine={false}
            axisLine={false}
            // axisLine={{ stroke: `${Styles.color.secondary}88` }}
          />
          <Bar dataKey={yDataKey}>
            {data.map((entry: any, index: number) => (
              <Cell
                key={`summary_cell_${index}`}
                style={{ transition: TRANSITION_DURATION }}
                fill={theme.color.primary}
                radius={4}
              />
            ))}
          </Bar>

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: `${theme.color.text}0c` }}
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export const formatDataCountForXDays = ({ data, numOfDays = 14 }: any) => {
  const formatConfigs = {
    daily: {
      formatType: 'MMM Do YY',
      numOfDataCategory: numOfDays,
      startOf: 'day',
      subtract: 'days',
    },
    hourly: {
      formatType: 'MMMM Do YYYY, ha',
      numOfDataCategory: numOfDays * 24,
      startOf: 'hour',
      subtract: 'hours',
    },
    minutely: {
      formatType: 'MMMM Do YYYY, hh:00 a',
      numOfDataCategory: 60,
      startOf: 'minute',
      subtract: 'minutes',
    },
  };

  let dataCategories = 'daily';
  if (numOfDays < 7) {
    dataCategories = 'hourly';
  }
  if (numOfDays < 1) {
    dataCategories = 'minutely';
  }

  const { formatType, numOfDataCategory, startOf, subtract } =
    formatConfigs['daily'];

  // Create an array for the numOfDays last days as string
  const lastXDaysArray = [...new Array(numOfDataCategory)].map((i, idx) => {
    if (dataCategories === 'hourly') {
      return moment().startOf('hour').subtract(idx, 'hours').format(formatType);
    }
    if (dataCategories === 'daily') {
      return moment().startOf('day').subtract(idx, 'days').format(formatType);
    }
    return moment().startOf('hour').subtract(idx, 'hours').format(formatType);
  });

  // Initialize an object that will store the number of occurence of the logs per day
  const lastXDaysCounterObj = lastXDaysArray.reduce(
    (a, v) => ({
      ...a,
      [v]: {
        totalWithSaleTax: 0,
        totalPrice: 0,
        totalSaleTax: 0,
        serviceFees: 0,
        shippingFee: 0,
        numOfItems: 0,
        totalTransactions: 0,
      },
    }),
    {}
  );

  // Iterate over the data array to count the occurence of the data
  data?.forEach((invoice) => {
    const logDate = moment(new Date(Number(invoice.createdAt))).format(
      formatType
    );
    const currentDate = lastXDaysCounterObj[logDate];
    if (currentDate !== undefined) {
      lastXDaysCounterObj[logDate].totalWithSaleTax = fixDecimal(
        invoice.totalWithSaleTax
      );
      lastXDaysCounterObj[logDate].totalPrice += fixDecimal(invoice.totalPrice);
      lastXDaysCounterObj[logDate].totalSaleTax += fixDecimal(
        invoice.totalSaleTax
      );
      lastXDaysCounterObj[logDate].serviceFees += fixDecimal(
        invoice.serviceFees
      );
      lastXDaysCounterObj[logDate].shippingFee += fixDecimal(
        invoice.shippingFee
      );
      lastXDaysCounterObj[logDate].numOfItems += invoice.cartItems.length;
      lastXDaysCounterObj[logDate].totalTransactions++;
    }
  });

  const sortedByDateDataset = Object.entries(lastXDaysCounterObj)
    .map((e) => ({ sales: e[1], date: e[0] }))
    .sort(function (a, b) {
      const keyA = new Date(a.date),
        keyB = new Date(b.date);
      // Compare the 2 dates
      if (keyA < keyB) return 1;
      if (keyA > keyB) return -1;
      return 0;
    });

  console.log(
    'sortedByDateDataset',
    sortedByDateDataset[0].sales?.totalWithSaleTax
  );

  return sortedByDateDataset.reverse();
};

const ResponsiveLineChart = ({
  data,
  xDataKey,
  yDataKey,
  AXIS_COLOR,
  Y_AXIS_PADDING,
}: any) => {
  return (
    <ResponsiveContainer width="100%" aspect={3}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey={yDataKey}
          stroke={'#000'}
          strokeWidth={4}
        />
        <CartesianGrid stroke={theme.color.lightText} vertical={false} />
        <XAxis
          dataKey={xDataKey}
          stroke={AXIS_COLOR}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={AXIS_COLOR}
          domain={[
            `dataMin - ${Y_AXIS_PADDING}`,
            `dataMax + ${Y_AXIS_PADDING}`,
          ]}
          tickLine={false}
          axisLine={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const ResponsiveChart = ({
  title,
  data,
  xDataKey,
  yDataKey,
  yAxisPadding,
  type = 'barChart',
  tooltipLabelOverride,
  subTitle,
  showDollarSign,
}: {
  title: any;
  type?: any;
  data: any;
  xDataKey: any;
  yDataKey: any;
  yAxisPadding?: any;
  tooltipLabelOverride?: any;
  subTitle: any;
  showDollarSign?: boolean;
}) => {
  const theme = useTheme();

  const AXIS_COLOR = theme.color.lightText;

  const Y_AXIS_PADDING = yAxisPadding ?? DEFAULT_Y_AXIS_PADDING;

  const chartProps = {
    AXIS_COLOR,
    Y_AXIS_PADDING,
    data,
    subTitle,
    title,
    tooltipLabelOverride,
    xDataKey,
    yDataKey,
    showDollarSign,
  };

  return (
    <>
      {type === 'barChart' && <ResponsiveBarChart {...chartProps} />}

      {type === 'lineChart' && <ResponsiveLineChart {...chartProps} />}
    </>
  );
};
