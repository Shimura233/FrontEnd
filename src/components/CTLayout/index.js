import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.scss';

import { ScrollArea } from 'components/ScrollArea';
import { CTNavHeader, CTNavHeaderPropsTypes } from './CTNavHeader';
import { CTNavSidebar, CTNavSidebarPropTypes } from './CTNavSidebar';
import NavSidebarTrigger from './NavSidebarTrigger';

/**
 * A general page container with the nav header and sidebar
 */
export function CTLayout(props) {
  let {
    role = "main",
    className,
    // styles
    defaultOpenSidebar = false,
    darkMode = false,
    transition = false,
    responsive = false,
    fill = false,
    // children
    children,
    // child props
    headerProps = {},
    sidebarProps = {}
  } = props;

  let { float = false, mini = false } = sidebarProps;

  const defaultSidebar = !defaultOpenSidebar ? null : float ? 'float' : mini ? 'mini' : 'normal';
  const [sidebar, setSidebar] = useState(defaultSidebar);

  const isNormal = sidebar === 'normal';
        const isMini = sidebar === 'mini';
        const isFloat = sidebar === 'float';
        const isOpen = Boolean(sidebar);
        const isClose = !isOpen;

  const handleOpenSidebar = () => {
    if (isMini) {
      setSidebar('normal');
    } else if (isNormal) {
      setSidebar('mini');
    } else if (isFloat) {
      setSidebar(null);
    } else if (isClose) {
      setSidebar(float ? 'float' : mini ? 'mini' : 'normal');
    }
  };

  const brandElemProps = {
    darkMode,
    showSidebar: isOpen,
    onSidebarTriggerClick: handleOpenSidebar,
  };
  const sidebarBrandElem = <NavSidebarTrigger {...brandElemProps} />;
  brandElemProps.withTrigger = !isMini;
  const headerBrandElem = isNormal 
                        ? <div /> 
                        : <NavSidebarTrigger {...brandElemProps} />;

  const containerClasses = classNames(className);
  const mainClasses = classNames(
    'ct-layout-main', 
    { 
      fill,
      transition,
      'padded-240': isNormal,
      'padded-50': isMini,
    }
  );

  const pageElement = fill 
                    ? <div className="ct-layout-fill">{children}</div>
                    : children;

  return (
    <div 
      scrollToTopButton="bottom right"
      id="ct-layout-container" 
      className={containerClasses}
    >
      <CTNavSidebar
        {...sidebarProps}
        darkMode={darkMode}
        show={isOpen}
        float={isFloat}
        mini={isMini}
        transition={transition}
        brandElem={sidebarBrandElem}
        onClose={handleOpenSidebar}
      />

      <ScrollArea 
        role={role}
        scrollToTopButton="bottom right"
        scrollClassName={mainClasses}
        disabled={fill}
      >
        <CTNavHeader
          {...headerProps}
          sticky
          darkMode={darkMode}
          brandElem={headerBrandElem}
        />

        {pageElement}
      </ScrollArea>
    </div>
  );
}

CTLayout.propTypes = {
  /** Additional classes. */
  className: PropTypes.string,

  /** Role of the `CTLayout`, default to be `role="main"` */
  role: PropTypes.string,
  
  /** True if open the sidebar when the `CTLayout` rendered */
  defaultOpenSidebar: PropTypes.bool,

  /** The `CTLayout` supports the dark mode */
  darkMode: PropTypes.bool,

  /** True if smoothly show and hide sidebar */
  transition: PropTypes.bool,

  /** Sidebar can be responsive to the screen width */
  responsive: PropTypes.bool,

  /** True if fill the whole page */
  fill: PropTypes.bool,
  
  /** Page content */
  children: PropTypes.node,
  
  /** Props to the nav header */
  headerProps: PropTypes.shape(CTNavHeaderPropsTypes),

  /** Props to the sidebar */
  sidebarProps: PropTypes.shape(CTNavSidebarPropTypes)
};